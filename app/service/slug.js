'use strict'

const Service = require('egg').Service

class SlugService extends Service {
  async getList() {
    // eslint-disable-next-line max-len
    const slugs = await this.app.mysql.select('wp_terms')

    return slugs
  }
  async add(data) {
    // eslint-disable-next-line max-len
    const slugsResult = await this.app.mysql.query(`
      INSERT INTO
        wp_terms
        (name, slug)
      VALUES
        ('${data.name}', '${data.slug}');
    `)
    
    if(slugsResult.affectedRows === 1) {
      const newSlug = await this.app.mysql.query(`
        SELECT
         *
        FROM 
          wp_terms
        WHERE 
          term_id=${slugsResult.insertId};
      `)

      return {
        statu: true,
        data: newSlug
      }
    } else {
      return {
        statu: false,
        data: slugsResult
      }
    }
  }
  async update(data) {
    // eslint-disable-next-line max-len
    const slugsResult = await this.app.mysql.query(`
      UPDATE 
        wp_terms
      SET 
        name='${data.name}',
        slug='${data.slug}'
      WHERE 
        term_id=${data.id};
    `)

    if(slugsResult.affectedRows === 1) {
      const newSlug = await this.app.mysql.query(`
        SELECT
         *
        FROM 
          wp_terms
        WHERE 
          term_id=${data.id};
      `)

      return {
        statu: true,
        data: newSlug
      }
    } else {
      return {
        statu: false,
        data: slugsResult
      }
    }
  }
  async delete(data) {
    // eslint-disable-next-line max-len
    const needToDelete = await this.app.mysql.query(`
        SELECT
         *
        FROM 
          wp_terms
        WHERE 
          term_id=${data.id};
      `)
    const slugsResult = await this.app.mysql.query(`
      DELETE FROM
        wp_terms
      WHERE 
        term_id=${data.id};
    `)

    if(slugsResult.affectedRows === 1) {

      return {
        statu: true,
        data: needToDelete
      }
    } else {
      return {
        statu: false,
        data: slugsResult
      }
    }
  }
}

module.exports = SlugService