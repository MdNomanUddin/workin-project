import { useEffect, useState } from "react";
import { db } from "../firebase/firebaseConfig";
import { collection, query, where, getDocs } from "firebase/firestore";
import { notifyError } from "./notification";



export default function Status() {

  interface ComplaintDataType {
    complaintId?: string;
    description?: string;
    userName?: string;
    dateReported?: string;
    assignedEngineer?: string;
  }
  const [complaintId, setComplaintId] = useState("");
  const [description, setDescription] = useState("");
  const [loggedInUser, setLoggedInUser] = useState("");
  const [complaintData, setComplaintData] = useState<ComplaintDataType>({}); // State to store all fetched complaint details


  useEffect(() => {
    // Get user email from local storage
    const user = JSON.parse(localStorage.getItem("loggedInUser")||"");
    const userEmail = user.email;
    setLoggedInUser(userEmail);
  }, []);

  const handleFormSubmit = async (e : any) => {
    e.preventDefault();

    try {
      const complaintsRef = collection(db, "complaints");
      const complaintsQuery = query(
        complaintsRef,
        where("complaintId", "==", complaintId),
        where("userEmail", "==", loggedInUser)
      );
      const querySnapshot = await getDocs(complaintsQuery);

      if (querySnapshot.empty) {
        notifyError("Invalid Complaint ID");
        setComplaintId("");
        setDescription("");
        setComplaintData({}); // Reset complaint details
        return;
      }

      querySnapshot.forEach((doc) => {
        // const { seconds, nanos } = doc.data().dateReported;
        // const milliseconds = seconds * 1000 + nanos / 1e6;
        // formattedDate = new Date(milliseconds);
        // console.log(formattedDate);
        const complaintData = doc.data() as ComplaintDataType; // Type assertion for safety
        setDescription(complaintData?.description ?? "Not available");
        console.log(complaintData);
        setComplaintData(complaintData);
        
      });
      
		//combine the seconds and nanos values into a single timestamp in milliseconds
		
	
    } catch (error) {
      console.error("Error searching complaints by ID:", error);
    }
  };

  return (
    <div>
      <h2>Check Complaint Status</h2>
      <form onSubmit={handleFormSubmit}>
        <input
          type="text"
          value={complaintId}
          onChange={(e) => setComplaintId(e.target.value)}
          placeholder="Enter complaint ID"
        />
        <button type="submit">Search</button>
      </form>
      {description && (
        <div>
          <table className="complaint-status-table">
            <thead>
              <tr>
                <th>Complaint ID</th>
                <th>Name</th>
                <th>Date</th>
                <th>Description</th>
                <th>Assigned Engineer</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                {/* Ensure safe access to properties using optional chaining */}
                <td>{complaintData.complaintId || "Not available"}</td>
                <td>{complaintData.userName || "Not available"}</td>
                <td>{complaintData.dateReported || "Not available"}</td>
                {/* <td>{formattedDate}</td> */}
                <td>{complaintData.description || "Not available"}</td>
                <td>{complaintData.assignedEngineer || "Not assigned"}</td>
                <td>
                 
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
