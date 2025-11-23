import React from 'react';
import { Link } from 'react-router-dom';

const NotFound = () => {
    return (
        <div className='min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-white overflow-hidden flex flex-col justify-center items-center'>
            <div className="text-8xl">404</div>
            <div className="text-4xl mt-2">Page Not Found</div>

            <Link to={"/"} className="mt-10 px-6 py-3 bg-slate-700 hover:bg-slate-600 rounded text-white">
                 ←  Home
            </Link>
        </div>
    );
};

export default NotFound;