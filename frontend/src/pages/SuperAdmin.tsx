import React from "react"
import AdminCard from "../components/AdminCard"
import "../styles/SuperAdmin.css"

const SuperAdmin: React.FC<defaultPageProps> = props => {
    const {user, token} = props

    if (user.admin < 2) return <div>Not authorized</div>
    else{
        return (
        <div>
            <h1>Welcome to the Super Admin panel</h1>
            <div className="manage">
                <div className="manage-title">
                    Manage current administators : 
                </div>
                <AdminCard {...props}/>
            </div>
        </div>
    )
    }
}

export default SuperAdmin