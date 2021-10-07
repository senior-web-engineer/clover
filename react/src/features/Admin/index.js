import React, {useEffect, useRef, useState} from 'react';
import {useGlobal} from "reactn";
import TopBar from "./components/TopBar";
import BottomBar from "./components/BottomBar";
import "./Admin.sass";
import search from "../../actions/search";
import DataTable from "react-data-table-component";
import {FiSearch} from "react-icons/fi";
import Popup from "./components/Popup";

const Admin = () => {
    const setOver = useGlobal('over')[1];
    const [users, setUsers] = useState([]);
    const searchInput = useRef();
    const [searchResults, setSearchResults] = useGlobal('searchResults');
    const [searchText, setSearch] = useGlobal('search');
    const [popup, setPopup] = useState(null);
    const [user, setUser] = useState(null);

    const onChange = e => {
        setSearch(e.target.value);
        search(e.target.value).then(res => setSearchResults(res.data.users)).catch(err => console.log(err));
    };

    useEffect(() => {
        search(searchText || null, 10000).then(res => {
            setUsers(res.data.users)
        });
    }, [searchText]);

    const back = () => setOver(false);

    const columns = [
        {
            name: "First Name",
            selector: "firstName",
            sortable: true,
        },
        {
            name: "Last Name",
            selector: "lastName",
            sortable: true,
        },
        {
            name: "Email",
            selector: "email",
            sortable: true,
        },
        {
            name: "Username",
            selector: "username",
            sortable: true,
        },
        {
            name: "Actions",
            selector: "actions",
            sortable: false,
            cell: row => (
                <div className="data-actions">
                    <a className="edit" onClick={() => {
                        setUser(row);
                        setPopup('edit');
                    }}>Edit</a>
                    <span className="separator">&nbsp;&nbsp;-&nbsp;&nbsp;</span>
                    <a className="delete" onClick={() => {
                        setUser(row);
                        setPopup('delete');
                    }}>Delete</a>
                </div>
            ),
        },
    ];

    let data = [];

    users.forEach(user => data.push({id: user._id, firstName: user.firstName, lastName: user.lastName, email: user.email, username: user.username}));

    return (
        <div className="admin content uk-flex uk-flex-column">
            <TopBar back={back} />
            <div className="search-bar uk-flex uk-flex-center uk-flex-middle">
                <div className="icon" onClick={() => searchInput.current.focus()}>
                    <FiSearch/>
                </div>
                <div className="uk-inline search">
                    <input className="uk-input uk-border-pill" placeholder="Search" ref={searchInput} onChange={onChange}/>
                </div>
            </div>
            <div className="content uk-flex uk-flex-center uk-flex-middle uk-flex-column">
                <div className="data-table" style={{background: '#fff'}}>
                    <div className="data-create">
                        <button className="uk-margin-small uk-button uk-button-honey" onClick={() => setPopup('create')}>Create</button>
                    </div>
                    <DataTable
                        title="Admin - Users"
                        columns={columns}
                        data={data}
                        defaultSortField="title"
                        pagination={true}
                        paginationPerPage={20}
                    />
                </div>
            </div>
            <BottomBar/>
            {popup && <Popup onClose={shouldUpdate => {
                if (shouldUpdate) search(searchText || null, 10000).then(res => {
                    setUsers(res.data.users)
                });
                setPopup(null);
            }} user={user} type={popup} />}
        </div>
    );
}

export default Admin;
