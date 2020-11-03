'use strict'

const Service = require('egg').Service

class CategoryService extends Service {
  async getList() {
    // eslint-disable-next-line max-len
    const categories = await this.app.mysql.query(`
      SELECT 
        wp_term_taxonomy.*,  wp_term_taxonomy.term_id as id, wp_terms.name, wp_terms.slug, wp_termmeta.meta_value as img
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

  async delete (id) {

    // 如果标签上有图像，删除掉七牛云上的资源
    // 删除分类事务
    const result = await this.app.mysql.beginTransactionScope(async conn => {

      // 将在这个分类下的文章设为未分类
      await conn.query(`update wp_term_relationships set term_taxonomy_id = 1 where term_taxonomy_id = ?`, [this.app.mysql.escape(id)])

      // update 列和where有相同值有bug https://github.com/ali-sdk/ali-rds/issues/66
      // await conn.update('wp_term_relationships', { term_taxonomy_id: 1 }, { 
      //   where: { term_taxonomy_id: id },
      //   columns: [ 'term_taxonomy_id' ]
      // })
      await conn.delete('wp_term_taxonomy', { term_id: id })
      await conn.delete('wp_terms', { term_id: id })
      return { success: true }
    }, this.ctx)

    return result
  }
}

module.exports = CategoryService