'use-strict';

const conn = require('../Configs/conn'),
    { getMaxPage } = require('./page');

exports.getOrders = (req, page) => {
    let sql = 'SELECT * FROM tb_orders JOIN tb_orders_detail ON tb_orders.order_id = tb_orders_detail.order_id JOIN tb_products ON tb_products.id = tb_orders_detail.prod_id order by tb_orders.created_at_ord DESC';

    return new Promise((resolve, reject) => {
        getMaxPage(page, null, "tb_orders").then(maxPage => {
            const infoPage = {
                currentPage: page.page,
                totalAllOrder: maxPage.totalProduct,
                maxPage: maxPage.maxPage
            };

            conn.query(`${sql} LIMIT ? OFFSET ?`, [page.limit, page.offset], (err, data) => {
                if (!err) resolve({
                    infoPage,
                    data
                });
                else reject(err);
            });
        }).catch(err => reject(err));
    });
}
exports.dataChart = (req, orderProdId) => {
    return new Promise((resolve, reject) => {
      const prodId = req.params.prod_id || orderProdId || req.body.prod_id;
      const sql = `SELECT SUM(total_price) as total_tahun from tb_orders WHERE created_at_ord BETWEEN '2020-01-01 00:00:00' AND '2021-01-01 23:30:00'`;
  
      conn.query(sql, (err, result) => {
        if (!err) resolve(result);
        else reject(err);
      });
    });
  };
  exports.dataSales = (req, orderProdId) => {
    return new Promise((resolve, reject) => {
      const prodId = req.params.prod_id || orderProdId || req.body.prod_id;
      const sql = `SELECT SUM(tb_orders_detail.quantity) as totalsales from tb_orders_detail`;
  
      conn.query(sql, (err, result) => {
        if (!err) resolve(result);
        else reject(err);
      });
    });
  };
exports.newOrder = async (req, order) => {
    return new Promise((resolve, reject) => {
        conn.query('INSERT INTO tb_orders SET admin_id = ?, order_id = ?, total_price = ?',
            [req.body.admin_id, order, req.body.total_price],
            (err, result) => {
                if (!err) {
                    const values = req.body.detail_order.map(item => [order, item.prod_id, item.quantity, item.sub_total]);
                    conn.query('INSERT INTO tb_orders_detail (order_id, prod_id, quantity, sub_total) VALUES ? ',
                        [values],
                        (err, result) => {
                            if (!err) resolve(result);
                            else reject(err);
                        }
                    );
                } else reject(err);
            });
    });
}

exports.updateStatusOrder = req => {
    const body = req.body;
    return new Promise((resolve, reject) => {
        conn.query('UPDATE tb_orders SET status = ?, cancel_reason = ? WHERE order_id = ?', [body.status, body.cancel_reason, req.params.order_id],
            (err, result) => {
                if (!err) resolve(result)
                else reject(err);
            });
    });
}

exports.updateQtyProduct = (product, status) => {
    let sql = '';
    const operator = status == 'success' ? '-' : '+';
    console.log(product);
    
    product.forEach((item, index) => {
        sql += `UPDATE tb_products SET quantity = quantity ${operator} ${item.quantity} WHERE id = ${item.prod_id};`;
    });

    return new Promise((resolve, reject) => {
        conn.query(sql, product, (err, result) => {
            if (!err) resolve(result);
            else reject(err);
        });
    });

}

exports.reduceQtyProduct = (product) => {
    return new Promise((resolve, reject) => {
        conn.query(`UPDATE tb_products SET quantity = quantity - ? WHERE id = ?`, [product.quantity, product.prod_id], (err, result) => {
            if(!err) resolve(result);
            else reject(err);
        })
    })
}

exports.getOrderById = (req, order) => {
    const orderId = req.params.order_id || req.body.order_id || order;
    return new Promise((resolve, reject) => {
        conn.query(`SELECT * FROM tb_orders WHERE order_id = ?`, [orderId],
            (err, result) => {
                if (!err) resolve(result);
                else reject(err);
            })
    });
}

exports.getDetailOrderById = orderId => {
    return new Promise((resolve, reject) => {
        conn.query(`SELECT prod_id, quantity, sub_total FROM tb_orders_detail WHERE order_id = ?`, [orderId],
            (err, result) => {
                if (!err) resolve(result);
                else reject(err);
            });
    })
}