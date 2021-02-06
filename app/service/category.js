'use strict'

const Service = require('egg').Service

class CategoryService extends Service {
  async getList() {
    // eslint-disable-next-line max-len
    const categories = await this.app.mysql.query(`
      SELECT 
        wp_term_taxonomy.term_taxonomy_id as id, wp_term_taxonomy.term_id, wp_term_taxonomy.taxonomy,
        wp_term_taxonomy.description, wp_term_taxonomy.parent, wp_term_taxonomy.name, wp_term_taxonomy.count, meta2.meta_value as img, wp_terms.slug
      FROM 
        wp_term_taxonomy 
      LEFT JOIN
        wp_termmeta meta2
      ON
        wp_term_taxonomy.term_taxonomy_id = meta2.term_id AND meta2.meta_key="img"
      LEFT JOIN
        wp_terms
      ON
        wp_term_taxonomy.term_id = wp_terms.term_id
      WHERE 
        taxonomy = "category"
    `)


    return categories
  }

  async add (data) {

    // const result = await this.app.mysql.insert('wp_terms', { 
    //   name: data.name,
    //   slug: data.slug
    // })

    // await this.app.mysql.insert('wp_term_taxonomy', { 
    //   term_id: result.insertId,
    //   taxonomy: 'category',
    //   parent: data.parent,
    //   description: data.description
    // })
    // await this.app.mysql.insert('wp_termmeta', {
    //   term_id: result.insertId,
    //   meta_key: 'meta_img',
    //   meta_value: data.meta_img
    // })
    // this.logger.info(result)
    // return result
    try {
      const result = await this.app.mysql.beginTransactionScope(async conn => {
        const slugResult = await conn.query(`CALL get_or_add_slug('${data.slug}');`)
        const insertResult = await conn.query(`
          INSERT INTO
            wp_term_taxonomy
            (term_id, taxonomy, description, parent, name)
          VALUES
            (${slugResult[0][0].term_id}, 'category', '${data.description ? data.description : ''}', ${data.parent ? data.parent : 0}, '${data.name}');
        `)
  
        if(insertResult.affectedRows === 1) {

          const insertMetaResult = await conn.query(`
            INSERT INTO
              wp_termmeta
              (term_id, meta_key, meta_value)
            VALUES
              (${insertResult.insertId}, 'img', '${data.img ? data.img : ''}');
          `)

          return insertResult
        }
      }, this.ctx)

      return {
        statu: true,
        data: result
      }
    } catch(err) {
      return {
        statu: false,
        data: err
      }
    }
  }
  
  async update(data) {
    try {
      const result = await this.app.mysql.beginTransactionScope(async conn => {
        const slugResult = await conn.query(`CALL get_or_add_slug('${data.slug}');`)
        const updateResult = await conn.query(`
          UPDATE
            wp_term_taxonomy
          SET 
            term_id = ${slugResult[0][0].term_id},
            description = '${data.description ? data.description : ''}',
            parent = ${data.parent ? data.parent : 0},
            name = '${data.name}'
          WHERE term_taxonomy_id=${data.id};
        `)
  
        if(updateResult.affectedRows === 1) {
          const isHasImgMeta = await conn.query(`
            SELECT
              meta_id
            FROM 
              wp_termmeta
            WHERE 
              term_id=${data.id} AND meta_key='img';
          `)

          if(isHasImgMeta.length > 0) {

            const updateMetaResult = await conn.query(`
              UPDATE
                wp_termmeta
              SET
                meta_value = '${data.img}'
              WHERE term_id=${data.id} AND meta_key='img';
            `)
          } else {
            const updateMetaResult = await conn.query(`
            INSERT INTO
              wp_termmeta
              (term_id, meta_key, meta_value)
            VALUES
              (${data.id}, 'img', '${data.img ? data.img : ''}');
          `)
          }

          return updateResult
        }
      }, this.ctx)

      return {
        statu: true,
        data: result
      }
    } catch(err) {
      return {
        statu: false,
        data: err
      }
    }
  }

  async delete (data) {
    try {

      // 如果标签上有图像，删除掉七牛云上的资源
      // 删除分类事务
      const result = await this.app.mysql.beginTransactionScope(async conn => {
  
        // 将在这个分类下的文章设为未分类
        // await conn.query(`update wp_term_relationships set term_taxonomy_id = 1 where term_taxonomy_id = ?`, [this.app.mysql.escape(data.id)])
  
        // update 列和where有相同值有bug https://github.com/ali-sdk/ali-rds/issues/66
        // await conn.update('wp_term_relationships', { term_taxonomy_id: 1 }, { 
        //   where: { term_taxonomy_id: id },
        //   columns: [ 'term_taxonomy_id' ]
        // })
        const needToDelete = await conn.query(`
          SELECT
           *
          FROM 
            wp_term_taxonomy
          WHERE 
            term_taxonomy_id=${data.id};
        `)
        const categoryDeleteResult = await conn.query(`
          DELETE FROM
            wp_term_taxonomy
          WHERE 
            term_taxonomy_id=${data.id};
        `)
        

        if(categoryDeleteResult.affectedRows === 1) {
  
          const categoryRelationsDeleteResult = await conn.query(`
            DELETE FROM
              wp_term_relationships
            WHERE 
              term_taxonomy_id=${data.id};
          `)
          const categoryDeleteMetaResult = await conn.query(`
          DELETE FROM
            wp_termmeta
          WHERE 
            term_taxonomy_id=${data.id};
        `)
  
          return needToDelete
        } else {
          return categoryDeleteResult
        }
      }, this.ctx)
      
      return {
        statu: true,
        data: result
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
        SELECT
          wp.*
        FROM 
          wp_posts wp
        INNER JOIN
          wp_term_relationships ws
        ON
          wp.ID = ws.object_id AND ws.term_taxonomy_id = ${data.id};
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

module.exports = CategoryService