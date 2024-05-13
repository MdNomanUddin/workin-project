import React, { useState, useEffect } from "react";
import { collection, query, where, getDocs } from "firebase/firestore";
import { db } from "../firebase/firebaseConfig";
import { useNavigate } from "react-router-dom";
import reportImage from "../assets/images/complaint.png";

interface ImageModalProps {
    imagePath: string;
    onClose: () => void;
}

const ImageModal: React.FC<ImageModalProps> = ({ imagePath, onClose }) => {
    const [isHovering, setIsHovering] = useState(false);

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-900 bg-opacity-75">
            <div className="relative bg-gray-300 p-4 mx-2 my-2 max-w-3xl max-h-3xl overflow-auto rounded">
                <span
                    className={`absolute top-0 right-0 mt-0 mr-1 text-gray-600 cursor-pointer-lg ${isHovering ? 'cursor-pointer' : ''}`}
                    onClick={onClose}
                    onMouseEnter={() => setIsHovering(true)}
                    onMouseLeave={() => setIsHovering(false)}
                >
                    &times;
                </span>
                <img src={imagePath} alt="Complaint" className="w-full max-h-screen object-contain rounded" />
            </div>
        </div>
    );
};

export default function NewComplaints() {
    const [complaints, setComplaints] = useState<Complaint[]>([]);
    const navigate = useNavigate();

    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState("");
    const [selectedImage, setSelectedImage] = useState(null);
    //const [sortBy, setSortBy] = useState("dateReported"); // Default sorting by date
    const [sortDirection, setSortDirection] = useState("desc");
    const [sortBy, setSortBy] = useState("dateReported_asc");



    const loggedInUser = JSON.parse(localStorage.getItem("loggedInUser") || "{}");
    console.log(loggedInUser);

    interface Complaint {
        id: string;
        imagePath?: string;
        description: string;
        location: string;
        dateReported: string;
        severity: number;
        status: string;
    }

    useEffect(() => {
        const fetchComplaints = async () => {
            try {
                setIsLoading(true);
                setError("");

                const q = query(collection(db, "complaints"), where("userName", "==", loggedInUser.name));
                const querySnapshot = await getDocs(q);

                const fetchedComplaints: Complaint[] = [];
                querySnapshot.forEach((doc) => {
                    const data = doc.data();
                    console.log(data);
                    const complaint: Complaint = {
                        id: data.complaintId,
                        imagePath: data.imagePath || "",
                        description: data.description,
                        location: data.location,
                        dateReported: data.dateReported,
                        severity: data.severity,
                        status: data.status,
                    };
                    fetchedComplaints.push(complaint);
                });

                setComplaints(fetchedComplaints);
                setIsLoading(false);
            } catch (error) {
                console.error("Error fetching complaints:", error);
                setError("Failed to load complaints. Please try again.");
                setIsLoading(false);
            }
        };


        fetchComplaints();
    }, [loggedInUser.name]);

    //   // Function to handle sorting by date or status
    const handleSort = (key: string) => {
        if (sortBy === key) {
            // If already sorted by the same key, toggle the sort direction
            setSortDirection(sortDirection === "asc" ? "desc" : "asc");
        } else {
            // If sorting by a different key, set it as the new sort key and default to descending
            setSortBy(key);
            setSortDirection("desc");
        }
    };
    //Function to sort complaints array based on the current sort key and direction
    const sortedComplaints = [...complaints].sort((a, b) => {
        const valueA = sortBy === "dateReported" ? new Date(a.dateReported).getTime() : a.status;
        const valueB = sortBy === "dateReported" ? new Date(b.dateReported).getTime() : b.status;

        // Custom sorting logic for status
        if (sortBy === "status") {
            const statusOrder = ["submitted", "In progress", "resolved", "closed"];
            const indexA = statusOrder.indexOf(a.status);
            const indexB = statusOrder.indexOf(b.status);
            return sortDirection === "asc" ? indexA - indexB : indexB - indexA;
        }

        return sortDirection === "asc" ? Number(valueA) - Number(valueB) : Number(valueB) - Number(valueA);

    });



    const openImageModal = (imagePath: any) => {
        setSelectedImage(imagePath);
    };

    const closeImageModal = () => {
        setSelectedImage(null);
    };

    return (
        <div >
            <div className="complaint-container flex justify-between items-center mb-4 m-5">
                <h2 className="text-2xl font-semibold leading-tight tracking-wide mt-5" >My Complaints</h2>
                <div className="relative w-60">
                    <svg className="absolute top-1/2 -translate-y-1/2 left-4 z-50" width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M16.5555 3.33203H3.44463C2.46273 3.33203 1.66675 4.12802 1.66675 5.10991C1.66675 5.56785 1.84345 6.00813 2.16004 6.33901L6.83697 11.2271C6.97021 11.3664 7.03684 11.436 7.0974 11.5068C7.57207 12.062 7.85127 12.7576 7.89207 13.4869C7.89728 13.5799 7.89728 13.6763 7.89728 13.869V16.251C7.89728 17.6854 9.30176 18.6988 10.663 18.2466C11.5227 17.961 12.1029 17.157 12.1029 16.251V14.2772C12.1029 13.6825 12.1029 13.3852 12.1523 13.1015C12.2323 12.6415 12.4081 12.2035 12.6683 11.8158C12.8287 11.5767 13.0342 11.3619 13.4454 10.9322L17.8401 6.33901C18.1567 6.00813 18.3334 5.56785 18.3334 5.10991C18.3334 4.12802 17.5374 3.33203 16.5555 3.33203Z" stroke="black" strokeWidth="1.6" strokeLinecap="round" />
                    </svg>
                    <select id="Offer" value={sortBy} onChange={(e) => handleSort(e.target.value)} className="h-12 border border-gray-300 text-gray-900 text-center text-lg font-normal leading-7 rounded-full block w-full py-2 px-6 appearance-none relative focus:outline-none bg-white transition-all duration-500 hover:border-gray-400 hover:bg-gray-50 focus-within:bg-gray-50">
                        <option value="dateReported" className="bg-gray-200 hover:bg-gray-300 h-10">Sort by Date</option>
                        <option value="status" className="bg-gray-200 hover:bg-gray-300 ">Sort by Status</option>
                    </select>
                    <svg className="absolute top-1/2 -translate-y-1/2 right-4 z-50 " width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M12.0002 5.99845L8.00008 9.99862L3.99756 5.99609" stroke="#111827" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                </div>
            </div>
            {isLoading ? (
                <p>Loading complaints...</p>
            ) : error ? (
                <p className="error-message">{error}</p>
            ) : (
                complaints.length > 0 ? (
                    <div className="w-5/5 overflow-auto dark:text-gray-800">

                        <table className="w-full ">
                            <thead>
                                <tr className="dark:bg-gray-300">
                                    <th className="border px-4 py-2">Complaint ID</th>
                                    <th className="border px-4 py-2">Location</th>
                                    <th className="border px-4 py-2">Description</th>
                                    <th className="border px-4 py-2">Date Reported</th>
                                    <th className="border px-4 py-2">Severity</th>
                                    <th className="border px-4 py-2"> Status</th>
                                    <th className="border px-4 py-2">Image</th>
                                </tr>
                            </thead>
                            <tbody className="">
                                {sortedComplaints.map((complaint, index) => (
                                    <tr key={`${complaint.id}-${index}`}> {/* Use a unique key */}
                                        <td className="border-b dark:bg-gray-50 dark:border-gray-300 px-4 py-2 text-center">{complaint.id}</td>
                                        <td className="border-b dark:bg-gray-50 dark:border-gray-300 px-4 py-2 text-center">{complaint.location}</td>
                                        <td className="border-b dark:bg-gray-50 dark:border-gray-300 px-4 py-2 text-center max-w-sm overflow-hidden">
                                            <div className="max-h-20 overflow-y-auto">{complaint.description}</div>
                                        </td>

                                        <td className="border-b dark:bg-gray-50 dark:border-gray-300 px-4 py-2 text-center ">{complaint.dateReported}</td>
                                        <td className="border-b dark:bg-gray-50 dark:border-gray-300 px-4 py-2 text-center">{complaint.severity}</td>
                                        <td className="border-b dark:bg-gray-50 dark:border-gray-300 px-4 py-2 text-center">{complaint.status}</td>
                                        <td className="border-b dark:bg-gray-50 dark:border-gray-300 px-4 py-2 text-center">

                                            <button className="text-white bg-purple-700 hover:bg-purple-800 focus:outline-none focus:ring-4 focus:ring-purple-300 font-large rounded-full text-sm px-5 py-2 text-center  dark:bg-purple-600 dark:hover:bg-purple-700 dark:focus:ring-purple-900  " onClick={() => openImageModal(complaint.imagePath)}>View</button>
                                        </td>
                                    </tr>
                                ))}
                                {selectedImage && <ImageModal imagePath={selectedImage} onClose={closeImageModal} />}

                                {isLoading && <p>Loading complaints...</p>}
                                {error && <p className="error-message">{error}</p>}
                            </tbody>
                        </table>
                    </div>
                ) : (
                    <div className="content flex flex-grow justify-center">
                        <div className="complaint-container  bg-gray-200 bg-opacity-75 ">
                            <div className="content max-w-lg rounded-md shadow-md bg-white p-6 flex flex-col items-center gap-4">
                                <img src={reportImage} alt="Report now image" className="w-24 h-24 rounded-md object-cover" />
                                <h2 className="text-2xl font-semibold leading-tight tracking-wide">You haven't made any complaints yet.</h2>
                                <p className="text-center text-gray-600">Click the button below to report potholes near you.</p>
                                <button type="button" className="px-8 py-3 font-semibold rounded-md text-gray-50 bg-purple-600" onClick={() => navigate("/Complaint")}>Report Potholes</button>
                            </div>
                        </div>
                    </div>
                )
            )}
        </div>
    );

}