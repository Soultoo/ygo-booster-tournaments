import { db } from './firebaseStuff';
import { collection, getDocs } from 'firebase/firestore';
import { useCollectionData } from 'react-firebase-hooks/firestore';

function UserDataTable() {
  const usersRef = collection(db, 'users');

  // Fetch all user documents using react-firebase-hooks
  const [users, loading, error] = useCollectionData(usersRef);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;

  return (
    <div className="dataTableContainer">
    <table className="userTable">
      <thead>
        <tr>
          <th>Namn</th>
          <th>Pengar</th>
          <th>Ackumulerade pengar</th>
          <th>Vinster</th>
          <th>Förluster</th>
        </tr>
      </thead>
      <tbody>
        {users.map(user => (
          <tr key={user.uid}>
            <td>{user.playerName}</td>
            <td>{user.money}</td>
            <td>{user.moneyAccrued}</td>
            <td>{user.wins}</td>
            <td>{user.losses}</td>
          </tr>
        ))}
      </tbody>
    </table>
    </div>
  );
}

export default UserDataTable;