class APIFeature {
  constructor(dbQuery, queryString) {
    this.dbQuery = dbQuery
    this.queryString = queryString
  }

  filter() {
    // ambil query string
    const queryObj = { ...this.queryString }
    const excludeFields = ['page', 'sort'] // di exclude karena nanti ada function tersendiri
    
    // seleksi query yang nanti memiliki function sendiri 
    excludeFields.forEach(el => delete queryObj[el])
    
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

    // jika tidak undefined
    // cari query menggunakan db query
    this.dbQuery = this.dbQuery.sort()


    return this
  }
}

module.exports = APIFeature