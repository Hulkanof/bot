import React from "react"

const SuperAdmin: React.FC<defaultPageProps> = props => {
    const {user, token} = props

    return (
        <div>
            <h1>Welcome!</h1>
            <div>
                <h2>User</h2>
                <p>ID: {user.id}</p>
                <p>Name: {user.name}</p>
                <p>Email: {user.email}</p>
                <p>Admin: {user.admin}</p>
            </div>
        </div>
    )
}

export default SuperAdmin