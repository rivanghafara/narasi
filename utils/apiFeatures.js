class APIFeature {
  constructor(dbQuery, queryString) {
    this.dbQuery = dbQuery
    this.queryString = queryString
  }

  filter() {
    // ambil query string
    const queryObj = { ...this.queryString }
    const excludeFields = ['page', 'sort', 'limit'] // di exclude karena nanti ada function tersendiri

    // seleksi query yang nanti memiliki function sendiri 
    excludeFields.forEach((el) => delete queryObj[el])

    /**
     * BEFORE QUERYING
     * 1) make everything lowercase
     * 2) remove any symbols
     * 3) remove space with slugify
     * 4) encode URI component
     * 5) after that, querying to db 
     */

    if (queryObj.location === "earth") {
      delete queryObj.location
    }

    if (typeof queryObj === 'undefined') {
      this.dbQuery = this.dbQuery.find({})
      return this
    }

    // const searchIndex = (!queryObj.project_name) ? queryObj : { $text: { $search: queryObj.project_name } } // implement it in the future

    // cari query menggunakan db query
    this.dbQuery = this.dbQuery.find(queryObj)

    // return hasil
    return this
  }

  sort() {
    // ambil query string khusus sort, cek apakah undefined atau tidak
    if (typeof this.queryString.sort === "undefined") {
      return this
    }

    const sort_by = this.queryString.sort.split(',').join(' ')

    try {
      this.dbQuery = this.dbQuery.sort(sort_by)
    } catch (error) {
      return this
    }

    return this
  }

  page() {
    const limitIndex = parseInt(this.queryString.limit) || 5
    const startIndex = parseInt((this.queryString.page - 1) * limitIndex) || 0

    this.dbQuery = this.dbQuery.skip(startIndex).limit(limitIndex)

    return this
  }
}

module.exports = APIFeature