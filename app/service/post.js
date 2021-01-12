'use strict'

const Service = require('egg').Service
const moment =require('moment')

class PostService extends Service {
  async getList(data) {
    // eslint-disable-next-line max-len
    const posts = await this.app.mysql.query(`
      SELECT * FROM wp_posts
      LIMIT ${data.pageSize} OFFSET ${(Number(data.currentPage) - 1) * Number(data.pageSize)};
    `)

    return posts
  }

  async getCount () {
    const count = await this.app.mysql.query('select count(*) as total from wp_posts')

    return count
  }

  async addPost(data) {
    try {
      const nowTime = moment().format('YYYY-MM-DD HH:mm:ss')
      const nowTimeUTC = moment.utc().format('YYYY-MM-DD HH:mm:ss')
      const result = await this.app.mysql.beginTransactionScope(async conn => {
        const insertResult = await conn.query(`
          INSERT INTO
            wp_posts
            (post_author, post_title, post_status, post_content,
              post_name, post_date, post_date_gmt, post_modified, post_modified_gmt, 
              post_excerpt, to_ping, pinged, post_content_filtered)
          VALUES
            (${data.auth}, '${data.title}', '${data.status}', '${data.content}',
            '${data.postName}', '${nowTime}', '${nowTimeUTC}', '${nowTime}', '${nowTimeUTC}', 
            '${data.excerpt}', '', '', '');
        `)
        
        if(insertResult.affectedRows === 1) {
          const insertRelationReault = await conn.query(`
            CALL add_relation_between_post_term_taxonomy(${insertResult.insertId}, '${data.category}', ',');
          `)
          const newPost = await conn.query(`
            SELECT
              *, func_get_category(${insertResult.insertId}) as category
            FROM 
              wp_posts
            WHERE 
              wp_posts.ID=${insertResult.insertId};
          `)

          return newPost
        } else {
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

  compareArrayReturnMapResult(newArray, oldArray) {
    let newMap = new Map()
    let oldMap = new Map()

    for(let [key, val] of newArray.entries()) {
      newMap.set(val, 1)
    }
    for(let [key, val] of oldArray.entries()) {
      oldMap.set(val, 1)
    }
    for(let [key, val] of oldMap.entries()) {
      if(newMap.has(key)) {
        newMap.set(key, 0)
      } else {
        newMap.set(key, -1)
      }
    }
    return newMap
  }
  async updatePost(data) {
    try {
      const nowTime = moment().format('YYYY-MM-DD HH:mm:ss')
      const nowTimeUTC = moment.utc().format('YYYY-MM-DD HH:mm:ss')
      const result = await this.app.mysql.beginTransactionScope(async conn => {
        const oldCategoryString = await conn.query(`
          SELECT func_get_category(${data.id}) as category
        `)
        let temp = oldCategoryString[0].category
        let oldCategoryArray = []
        let newCategoryArray = data.category.trim() ? data.category.trim().split(',') : []

        if(temp) {
          oldCategoryArray = [...temp.split(',')]
        }
        let compare = this.compareArrayReturnMapResult(newCategoryArray, oldCategoryArray)
        let needToAdd = []
        let needToDelete = []

        for(let [key, val] of compare.entries()) {
          if(val === 1) {
            needToAdd.push(key)
          } else if (val === -1) {
            needToDelete.push(key)
          }
        }
        const updateResult = await conn.query(`
          UPDATE
            wp_posts
          SET
            post_title = '${data.title}',
            post_status = '${data.status}',
            post_content = '${data.content}',
            post_name = '${data.postName}',
            post_modified = '${nowTime}',
            post_modified_gmt = '${nowTimeUTC}',
            post_excerpt = '${data.excerpt}'
          WHERE 
           ID = ${data.id}
        `)

        if(needToAdd.length > 0) {
          const addRelationResult = await conn.query(`
            CALL add_relation_between_post_term_taxonomy(${data.id}, '${needToAdd.join(',')}', ',');
          `)
        }
        if(needToDelete.length > 0) {
          const deleteRelationResult = await conn.query(`
            CALL delete_relation_between_post_term_taxonomy(${data.id}, '${needToDelete.join(',')}', ',');
          `)
        }

        if(updateResult.affectedRows === 1) {

          // const newPost = await conn.query(`
          //   SELECT
          //     *, func_get_category(${data.id}) as category
          //   FROM 
          //     wp_posts
          //   WHERE 
          //     wp_posts.ID=${data.id};
          // `)

          return updateResult
        } else {
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
}

module.exports = PostService