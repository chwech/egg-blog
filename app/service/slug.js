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
    const deleteSlugsResult = await this.app.mysql.query(`
      DELETE FROM
        wp_terms
      WHERE 
        term_id=${data.id};
    `)
    const deleteSlugRelationResult = await this.app.mysql.query(`
      UPDATE
        wp_term_taxonomy
      SET
        term_id = 1
      WHERE
        term_id=${data.id};
    `)

    if(deleteSlugsResult.affectedRows === 1) {

      return {
        statu: true,
        data: needToDelete
      }
    } else {
      return {
        statu: false,
        data: deleteSlugsResult
      }
    }
  }

  async getCategory(data) {
    try {
      const category = await this.app.mysql.query(`
        SELECT
          *
        FROM 
          wp_term_taxonomy
        WHERE 
          term_id = (SELECT term_id FROM wp_terms WHERE slug = '${data.slug}');
      `)

      return {
        statu: true,
        data: category
      }
    } catch(err) {
      return {
        statu: false,
        data: err
      }
    }
  }

  async getPost(data) {
    try {
      const category = await this.app.mysql.query(`
        SELECT DISTINCT 
          wp.*
        FROM 
          wp_posts wp
        INNER JOIN
          wp_term_relationships ws
        ON
          wp.ID = ws.object_id AND ws.term_taxonomy_id in (func_slug_get_category('${data.slug}'));
      `)

      return {
        statu: true,
        data: category
      }
    } catch(err) {
      return {
        statu: false,
        data: err
      }
    }
  }
}

module.exports = SlugService