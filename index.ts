import parseAllowList from './actions/parseAllowList';
import parseUser from './actions/parseUser';
import getRankedUsers from './actions/getRankedUsers';

import updateUser from './database/updateUser';
import getAllUsers from './database/getAllUsers';

async function updateDatabaseFromAllowList(): Promise<void> {
  const allowList = await parseAllowList();
  for (const userID of allowList) {
    let isErrorResolved = false;
    let errorCount = 0;
    while (!isErrorResolved) {
      if (errorCount > 3) {
        break;
      }
      try {
        const user = await parseUser(userID);
        updateUser(user);
        isErrorResolved = true
      } catch (error) {
        console.error(error, error.stack);
        errorCount ++;
      }
    }
  }
}

async function main(): Promise<void> {
  await updateDatabaseFromAllowList();
  const users = getAllUsers();
  const rankedUsers = await getRankedUsers(users);
  console.log(rankedUsers);
}

main();
