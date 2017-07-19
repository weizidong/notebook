import low from 'lowdb'
import {createFolder} from '../utils'
createFolder('./DB/data.db')
const db = low('./DB/data.db');
db._.mixin(require('lodash-id'));
// Set some defaults if your JSON file is empty
db.defaults({project: [], user: {}}).write()
export const projectDB = db.get('project');
export default db;
