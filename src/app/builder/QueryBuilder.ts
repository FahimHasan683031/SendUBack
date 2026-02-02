import { FilterQuery, Query, PopulateOptions } from 'mongoose'

class QueryBuilder<T> {
  public modelQuery: Query<T[], T>
  public query: Record<string, unknown>

  constructor(modelQuery: Query<T[], T>, query: Record<string, unknown>) {
    this.modelQuery = modelQuery
    this.query = query
  }

  // Searching
  search(searchableFields: string[]) {
    if (this?.query?.searchTerm) {
      this.modelQuery = this.modelQuery.find({
        $or: searchableFields.map(
          field =>
            ({
              [field]: {
                $regex: this.query.searchTerm,
                $options: 'i',
              },
            }) as FilterQuery<T>,
        ),
      })
    }
    return this
  }

  // Filtering
  // Filtering
  filter() {
    const queryObj = { ...this.query }
    const excludeFields = [
      'searchTerm',
      'sort',
      'page',
      'limit',
      'fields',
      'withLocked',
      'showHidden',
      'download',
    ]
    excludeFields.forEach(el => delete queryObj[el])

    const filters: Record<string, any> = cleanObject(queryObj)

    // Handle salary range filtering
    if (queryObj.minSalary || queryObj.maxSalary) {
      if (queryObj.minSalary) {
        filters.minSalary = { $gte: Number(queryObj.minSalary) }
        delete queryObj.minSalary
      }
      if (queryObj.maxSalary) {
        filters.maxSalary = { $lte: Number(queryObj.maxSalary) }
        delete queryObj.maxSalary
      }
    }

    // ✅ Add partial match for jobLocation
    if (this.query.jobLocation) {
      filters.jobLocation = {
        $regex: this.query.jobLocation,
        $options: 'i', // case-insensitive
      }
    }

    // Handle date range aliases (startDate, endDate, from, to) mapping to createdAt
    const dateRangeFilters: Record<string, any> = {}
    if (queryObj.startDate || queryObj.from) {
      dateRangeFilters.$gte = new Date((queryObj.startDate || queryObj.from) as string)
      delete filters.startDate
      delete filters.from
    }
    if (queryObj.endDate || queryObj.to) {
      const endVal = (queryObj.endDate || queryObj.to) as string
      const date = new Date(endVal)
      if (endVal.length <= 10) {
        date.setHours(23, 59, 59, 999)
      }
      dateRangeFilters.$lte = date
      delete filters.endDate
      delete filters.to
    }
    if (Object.keys(dateRangeFilters).length > 0) {
      filters.createdAt = { ...(filters.createdAt || {}), ...dateRangeFilters }
    }

    // Handle comma separated values for $in operator and comparison operators
    Object.keys(filters).forEach(key => {
      let value = filters[key]
      let targetKey = key

      // Handle field[op] syntax (e.g., createdAt[gte]) if not parsed into object
      const operatorMatch = key.match(/^(.+)\[(gte|lte|gt|lt)\]$/)
      if (operatorMatch) {
        const field = operatorMatch[1]
        const op = operatorMatch[2]
        delete filters[key]
        filters[field] = { ...(filters[field] || {}), [op]: value }
        targetKey = field
        value = filters[field]
      }

      // @ts-ignore
      const pathInfo = this.modelQuery.model.schema.path(targetKey)
      // Check if it's a date field (explicitly in schema or standard timestamp)
      const isDateField =
        (pathInfo && (pathInfo.instance === 'Date' || (pathInfo as any).caster?.instance === 'Date')) ||
        targetKey === 'createdAt' ||
        targetKey === 'updatedAt'

      // Handle operators (gte, lte, gt, lt)
      if (value && typeof value === 'object' && !Array.isArray(value)) {
        const operators: Record<string, any> = {}
        const validOperators = ['gte', 'lte', 'gt', 'lt']
        Object.keys(value).forEach(op => {
          if (validOperators.includes(op)) {
            let val = (value as any)[op]

            // Cast to Date if it's a date field
            if (isDateField && typeof val === 'string') {
              const date = new Date(val)
              if (!isNaN(date.getTime())) {
                // If it's lte/lt and only a date (no time), adjust to end of day
                if ((op === 'lte' || op === 'lt') && val.length <= 10) {
                  date.setHours(23, 59, 59, 999)
                }
                val = date
              }
            }

            operators[`$${op}`] = val
          }
        })
        if (Object.keys(operators).length > 0) {
          filters[targetKey] = operators
        }
      } else if (isDateField && typeof value === 'string' && value.length <= 10) {
        // If it's a date field and an exact YYYY-MM-DD is provided, convert to a 24h range
        // This ensures items created at any time during that day are matched
        const startDate = new Date(value)
        if (!isNaN(startDate.getTime())) {
          const endDate = new Date(value)
          endDate.setHours(23, 59, 59, 999)
          filters[targetKey] = { $gte: startDate, $lte: endDate }
        }
      }

      // Handle comma separated values for $in operator
      if (typeof value === 'string' && value.includes(',')) {
        filters[targetKey] = { $in: value.split(',').map(item => item.trim()) }
      }
    })

    this.modelQuery = this.modelQuery.find(filters as FilterQuery<T>)
    return this
  }



  // Sorting
  sort() {
    let sort = (this?.query?.sort as string) || '-createdAt'
    this.modelQuery = this.modelQuery.sort(sort)
    return this
  }

  // Pagination
  paginate() {
    let limit = Number(this?.query?.limit) || 10
    let page = Number(this?.query?.page) || 1
    let skip = (page - 1) * limit

    this.modelQuery = this.modelQuery.skip(skip).limit(limit)
    return this
  }

  // Fields filtering
  fields() {
    let fields = (this?.query?.fields as string)?.split(',').join(' ') || '-__v'
    this.modelQuery = this.modelQuery.select(fields)
    return this
  }

  // Populating (flat + nested supported)
  populate(
    populateFields: (string | PopulateOptions)[],
    selectFields: Record<string, unknown> = {},
  ) {
    this.modelQuery = this.modelQuery.populate(
      populateFields.map(field =>
        typeof field === 'string'
          ? { path: field, select: selectFields[field] }
          : field,
      ),
    )
    return this
  }

  // Pagination info
  async getPaginationInfo() {
    const total = await this.modelQuery.model.countDocuments(
      this.modelQuery.getFilter(),
    )
    const limit = Number(this?.query?.limit) || 10
    const page = Number(this?.query?.page) || 1
    const totalPage = Math.ceil(total / limit)

    return {
      total,
      limit,
      page,
      totalPage,
    }
  }
}

function cleanObject(obj: Record<string, any>) {
  const cleaned: Record<string, any> = {}
  for (const key in obj) {
    const value = obj[key]
    if (
      value !== null &&
      value !== undefined &&
      value !== '' &&
      value !== 'undefined' &&
      !(Array.isArray(value) && value.length === 0) &&
      !(
        typeof value === 'object' &&
        !Array.isArray(value) &&
        Object.keys(value).length === 0
      )
    ) {
      cleaned[key] = value
    }
  }
  return cleaned
}

export default QueryBuilder
