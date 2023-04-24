import * as SQLite from 'expo-sqlite';

const db = SQLite.openDatabase('little_lemon');

export async function createTable() {
  return new Promise((resolve, reject) => {
    db.transaction(
      (tx) => {
        tx.executeSql(
          'create table if not exists menuitems (id integer primary key not null, name text, price text, description text, category text, image text);'
        );
      },
      reject,
      resolve
    );
  });
}

export function clearDatabase() {
  return new Promise((resolve, reject) => {
    db.transaction(
      (tx) => {
        tx.executeSql('DROP TABLE menuitems');

      },
      reject,
      resolve
    );
    console.log('database cleared');
  });
}

export async function getMenuItems() {
  return new Promise((resolve) => {
    db.transaction((tx) => {
      tx.executeSql('select * from menuitems', [], (_, { rows }) => {
        resolve(rows._array);
      });

    });
    
  });
}

export function saveMenuItems(menuItems) {
  db.transaction((tx) => {

    let SQLItems = []
    menuItems.forEach(e => {
      SQLItems.push(e.name, e.price, e.description, e.category, e.image);
    });

    let endStatement = '';
    for (let index = 0; index < SQLItems.length/5; index++) { //was /4
      endStatement+= '(?,?,?,?,?),'
    }

    endStatement = endStatement.slice(0,endStatement.length-1)
    tx.executeSql(        
      'INSERT INTO menuitems (name,price,description,category,image) VALUES ' + endStatement,
      SQLItems,
      (tx, results) => {    
        if (results.rowsAffected > 0 ) {
          console.log('Insert success');              
        } else {
          console.log('Insert failed');
        }
      }
    );
  });
}

export async function filterByQueryAndCategories(query, activeCategories) {
  return new Promise((resolve, reject) => {
    // console.log(query)
    // console.log(activeCategories)
    catString = "("
    activeCategories.forEach(e => {
      catString+='"'+e+'",'
    })
    catString = catString.slice(0,catString.length-1)
    catString += ')'
    // console.log(catString)
    db.transaction((tx) => {
      tx.executeSql('select * from menuitems where category in '+catString+' and name like "%'+query+'%"', [], (_, { rows }) => {
        // console.log('rows:',rows._array)
        resolve(rows._array);
      });
    });
  });
}