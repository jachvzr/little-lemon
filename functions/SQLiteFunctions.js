import * as SQLite from 'expo-sqlite';

const db = SQLite.openDatabase('little_lemon');

export async function createTable() {
  return new Promise((resolve, reject) => {
    db.transaction(
      (tx) => {
        tx.executeSql(
          // 'create table if not exists menuitems (id integer primary key not null, uuid text, title text, price text, category text);'
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
        // tx.executeSql('DELETE FROM menuitems');
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
      // tx.executeSql('delete from menuitems', [], (_, { rows }) => {
      // });
    });
    
  });
}

export function saveMenuItems(menuItems) {
  db.transaction((tx) => {
    // 2. Implement a single SQL statement to save all menu data in a table called menuitems.
    // Check the createTable() function above to see all the different columns the table has
    // Hint: You need a SQL statement to insert multiple rows at once.
    let SQLItems = []
    menuItems.forEach(e => {
      SQLItems.push(e.name, e.price, e.description, e.category, e.image); //check if e.id is required!!!
    });

    let endStatement = '';
    for (let index = 0; index < SQLItems.length/5; index++) { //was /4
      endStatement+= '(?,?,?,?,?),'
    }

    endStatement = endStatement.slice(0,endStatement.length-1)
    tx.executeSql(        
      // 'INSERT INTO menuitems (uuid,title,price,category) VALUES (?,?,?,?),(?,?,?,?)',
      // ['1','1','1','1','1','1','1','1'],
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



/**
 * 4. Implement a transaction that executes a SQL statement to filter the menu by 2 criteria:
 * a query string and a list of categories.
 *
 * The query string should be matched against the menu item titles to see if it's a substring.
 * For example, if there are 4 items in the database with titles: 'pizza, 'pasta', 'french fries' and 'salad'
 * the query 'a' should return 'pizza' 'pasta' and 'salad', but not 'french fries'
 * since the latter does not contain any 'a' substring anywhere in the sequence of characters.
 *
 * The activeCategories parameter represents an array of selected 'categories' from the filter component
 * All results should belong to an active category to be retrieved.
 * For instance, if 'pizza' and 'pasta' belong to the 'Main Dishes' category and 'french fries' and 'salad' to the 'Sides' category,
 * a value of ['Main Dishes'] for active categories should return  only'pizza' and 'pasta'
 *
 * Finally, the SQL statement must support filtering by both criteria at the same time.
 * That means if the query is 'a' and the active category 'Main Dishes', the SQL statement should return only 'pizza' and 'pasta'
 * 'french fries' is excluded because it's part of a different category and 'salad' is excluded due to the same reason,
 * even though the query 'a' it's a substring of 'salad', so the combination of the two filters should be linked with the AND keyword
 *
 */
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