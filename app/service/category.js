'use strict'

const Service = require('egg').Service

class CategoryService extends Service {
  async getList() {
    // eslint-disable-next-line max-len
    const categories = await this.app.mysql.query(`
      SELECT 
        wp_term_taxonomy.*,  wp_terms.name, wp_terms.slug, wp_termmeta.meta_value as img
      FROM 
        wp_term_taxonomy 
      LEFT JOIN 
        wp_terms
      ON 
        wp_term_taxonomy.term_id = wp_terms.term_id
      LEFT JOIN
        wp_termmeta 
      ON
        wp_term_taxonomy.term_id = wp_termmeta.term_id
      WHERE 
        taxonomy = "category"
      ORDER BY
        wp_terms.name
    `)

    return categories
  }

  async add (data) {
    const result = await this.app.mysql.insert('wp_terms', { 
      name: data.name,
      slug: data.slug
    })

    await this.app.mysql.insert('wp_term_taxonomy', { 
      term_id: result.insertId,
      taxonomy: 'category',
      parent: data.parent,
      description: data.description
    })
    await this.app.mysql.insert('wp_termmeta', {
      term_id: result.insertId,
      meta_key: 'meta_img',
      meta_value: data.meta_img
    })
    this.logger.info(result)
    return result
  }
}

module.exports = CategoryService