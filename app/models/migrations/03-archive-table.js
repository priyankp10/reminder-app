/**
 * This migration adds a new table for holding all the
 * arhived reminders.
*/

const { db } = require('../db');

const tableName = 'archive-reminders';
async function migrate_03_archive_table() {
  const tableAdded = await db.hasTable(tableName);
  if (tableAdded) {
    return;
  }

  const arhive = await db.createTable(tableName);
  const { types } = db;
  await arhive.addField({ name: 'date', type: types.date, default: Date.now });
  await arhive.addField({ name: 'reminder', type: types.object, required: true });
}

module.exports = migrate_03_archive_table;
