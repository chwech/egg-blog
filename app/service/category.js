'use strict'

const Service = require('egg').Service

class CategoryService extends Service {
  async getList() {
    // eslint-disable-next-line max-len
    const categories = await this.app.mysql.query(`
      SELECT 
        wp_term_taxonomy.*,  wp_terms.name, wp_terms.slug
      FROM 
        wp_term_taxonomy 
      LEFT JOIN 
        wp_terms
      ON 
        wp_term_taxonomy.term_id = wp_terms.term_id
      WHERE 
        taxonomy = "category"
      ORDER BY
        wp_terms.name
    `)

    return categories
  }
}

module.exports = CategoryService