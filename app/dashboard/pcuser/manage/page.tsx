// UserManagePage.tsx
"use client"
import { ChangeEvent, useEffect, useState } from 'react';
import { User, fetchUsersByYear, trashUsersByYear, restoreUsersByYear, trashUsersByUserId, fetchUsers } from './service';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import Image from 'next/image';

const UserManagePage = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [endYear, setEndYear] = useState<Date | null>(null);
  const [loading, setLoading] = useState(false); // State to manage loading state of API calls
  const [perPage, setPerPage] = useState<number>(5);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [message, setMessage] = useState(false);
  const [userId, setUserId]= useState('');
  useEffect(() => {
    if (endYear) {
      fetchUserss(); // Fetch users initially when endYear changes
    }
  }, [endYear]);
  useEffect(() => {
    const fetchUsersWithSearch = async () => {
      const response = await fetchUsers();
      const filteredUsers = response.filter((user) =>
        user.userId.includes(searchQuery)
      );
      setUsers(filteredUsers);
    };
    fetchUsersWithSearch();
  }, [searchQuery, perPage, currentPage]);
  const fetchUserss = () => {
    setLoading(true);
    fetchUsersByYear(endYear!.getFullYear().toString())
      .then((data) => setUsers(data))
      .catch((error) => console.error('Error fetching users:', error))
      .finally(() => setLoading(false));
  };

  const handleTrash = async () => {
    if (endYear) {
      try {
        setLoading(true);
        await trashUsersByYear(endYear.getFullYear().toString());
        setUsers([]);
        setMessage(true);
      } catch (error) {
        console.error('Error trashing users:', error);
        setMessage(true);
      } finally {
        setLoading(false);
      }
    }
  };

  const handleUserTrash=async(userId: string)=>{
    if(userId){
      try{
        setLoading(true);
        await trashUsersByUserId(userId);
        setUserId('');
        if (confirm("Are you sure you want to trashed this user?")) {
          const response = await fetchUsers();
          const filteredUsers = response.filter((user) =>
            user.userId.includes(searchQuery)
          );
          setUsers(filteredUsers);
        }
      } catch (error) {
        console.error('Error trashing users:', error);
        setMessage(true);
      } finally {
        setLoading(false);
      }
    }
  }

  const handleRestore = async () => {
    if (endYear) {
      try {
        setLoading(true);
        await restoreUsersByYear(endYear.getFullYear().toString());
        setUsers([]);
        setMessage(true);
      } catch (error) {
        console.error('Error restoring users:', error);
        setMessage(true);
      } finally {
        setLoading(false);
      }
    }
  };

  const handleSearch = () => {
    setCurrentPage(1);
  };

  const handlePerPageChange = (e: ChangeEvent<HTMLSelectElement>) => {
    setPerPage(Number(e.target.value));
    setCurrentPage(1);
  };
  const totalPages = Math.ceil(users.length / perPage);

  const handlePrevious = () => {
    // Navigate to the previous page if not on the first page
    if (currentPage > 1) {
      setCurrentPage((prev) => prev - 1);
    }
  };

  const handleNext = () => {
    // Navigate to the next page if not on the last page
    if (currentPage < totalPages) {
      setCurrentPage((prev) => prev + 1);
    }
  };

  function handleDelete(userId: string): void {
    throw new Error('Function not implemented.');
  }

  return (
    <div className="p-4">
      {/* <h1 className="text-xl mb-4">Manage PC Users</h1> */}
      <div className="mb-4">
        <label className="mr-2">Select End Year:</label>
        <DatePicker
          selected={endYear}
          onChange={(date) => setEndYear(date)}
          dateFormat="yyyy-MM-dd"
          className="border border-gray-300 px-4 py-2 rounded"
        />
      </div>
      <div className="mb-4">
        <input
          type="text"
          placeholder="Search by User Id"
          value={searchQuery}
          onChange={(e: ChangeEvent<HTMLInputElement>) => setSearchQuery(e.target.value)}
          className="border border-gray-300 px-4 py-2 rounded mr-2"
        />
        <button
          onClick={handleSearch}
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        >
          Search
        </button>
      </div>
      {/* <div className="mb-4">
        <button
          onClick={handleTrash}
          disabled={!endYear || loading} // Disable button when no endYear selected or operation in progress
          className="bg-blue-300 hover:bg-red-700 text-white font-bold py-2 px-4 rounded mr-2"
        >
          {loading ? 'Trashing...' : 'Trash Users'}
        </button>
        <button
          onClick={handleRestore}
          disabled={!endYear || loading} // Disable button when no endYear selected or operation in progress
          className="bg-blue-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
        >
          {loading ? 'Restoring...' : 'Restore Users'}
        </button>
      </div> */}
      <table className="min-w-full bg-white border border-gray-300">
        <thead className="bg-gray-100">
          <tr>
            <th className="p-4 text-center">Name</th>
            <th className="p-4 text-center">User ID</th>
            <th className="p-4 text-center">Description</th>
            <th className="p-4 text-center">Brand</th>
            <th className="p-4 text-center">Serial Number</th>
            <th className="p-4 text-center">Gender</th>
            <th className="p-4 text-center">Image</th>
            {/* <th className="p-4 text-center">Barcode</th> */}
            <th className="p-4 text-center">Trash</th>
          </tr>
        </thead>
        <tbody>
          {users.slice((currentPage - 1) * perPage, currentPage * perPage).map((user) => (
            <tr key={user.userId} className="bg-gray-50">
              <td className="p-4 border">{user.firstname} {user.lastname}</td>
              <td className="p-4 border">{user.userId}</td>
              <td className="p-4 border">{user.description} owner: {} {user.description === "Staff" ? user.pcowner : "Self/Personal"}</td>
              <td className="p-4 border">{user.brand}</td>
              <td className="p-4 border">Serial {user.serialnumber}</td>
              <td className="p-4 border">{user.gender}</td>
              <td className="p-4 border">
                <img src={`https://dbuprm-backend-1.onrender.com/pcuser/${user.image}`} alt={user.firstname} width ={200} height={200} className="w-24 h-24" />
              </td>
              {/* <td className="p-4 border">
                <Barcode filename={user.barcode} />
              </td> */}
              <td className="p-4 border flex flex-row gap-4 items-center justify-center">
                {/* <Link href={`/dashboard/task/update?id=${user.userId}`} className="cursor-pointer text-blue-500">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="size-6">
                    <path d="M21.731 2.269a2.625 2.625 0 0 0-3.712 0l-1.157 1.157 3.712 3.712 1.157-1.157a2.625 2.625 0 0 0 0-3.712ZM19.513 8.199l-3.712-3.712-12.15 12.15a5.25 5.25 0 0 0-1.32 2.214l-.8 2.685a.75.75 0 0 0.933.933l2.685-.8a5.25 5.25 0 0 0 2.214-1.32L19.513 8.2Z" />
                  </svg>
                </Link> */}
                <div className="cursor-pointer text-red-500" onClick={() => handleUserTrash(user.userId)}>
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="size-6">
                    <path fillRule="evenodd" d="M16.5 4.478v.227a48.816 48.816 0 0 1 3.878.512.75.75 0 1 1-.256 1.478l-.209-.035-1.005 13.07a3 3 0 0 1-2.991 2.77H8.084a3 3 0 0 1-2.991-2.77L4.087 6.66l-.209.035a.75.75 0 0 1-.256-1.478A48.567 48.567 0 0 1 7.5 4.705v-.227c0-1.564 1.213-2.9 2.816-2.951a52.662 52.662 0 0 1 3.369 0c1.603.051 2.815 1.387 2.815 2.951Zm-6.136-1.452a51.196 51.196 0 0 1 3.273 0C14.39 3.05 15 3.684 15 4.478v.113a49.488 49.488 0 0 0-6 0v-.113c0-.794.609-1.428 1.364-1.452Zm-.355 5.945a.75.75 0 1 0-1.5.058l.347 9a.75.75 0 1 0 1.499-.058l-.346-9Zm5.48.058a.75.75 0 1 0-1.498-.058l-.347 9a.75.75 0 0 0 1.5.058l.345-9Z" clipRule="evenodd" />
                  </svg>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className="flex justify-between items-center mt-4 flex-wrap">

{/* Rows per page selection */}
<div className="flex items-center">
  <select
    value={perPage}
    onChange={handlePerPageChange}
    className="border border-gray-300 px-4 py-2 rounded text-end"
  >
    {[5, 10, 25, 50, 100].map((value) => (
      <option key={value} value={value}>
        {value} row
      </option>
    ))}
  </select>
</div>

{/* Pagination Controls */}
<div className="flex items-center">
  <button
    onClick={handlePrevious}
    className={`px-4 py-2 mr-2 rounded ${
      currentPage === 1
        ? "bg-gray-300 cursor-not-allowed"
        : "bg-gray-200 hover:bg-gray-300"
    }`}
    disabled={currentPage === 1}
  >
    Previous
  </button>
  <span className="px-4 py-2 bg-gray-100 border rounded">
    Page {currentPage} of {totalPages}
  </span>
  <button
    onClick={handleNext}
    className={`px-4 py-2 ml-2 rounded ${
      currentPage === totalPages
        ? "bg-gray-300 cursor-not-allowed"
        : "bg-gray-200 hover:bg-gray-300"
    }`}
    disabled={currentPage === totalPages}
  >
    Next
  </button>
</div>

{/* Success Message */}
{message && (
  <div className="flex items-center text-green-500">
    {message}
  </div>
)}
</div>
    </div>
  );
};

export default UserManagePage;
