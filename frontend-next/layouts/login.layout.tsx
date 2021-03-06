import { AppProps } from 'next/app'

import React, {ReactNode, useState} from 'react'
import Head from "next/head";

import withAuth from "../HOC/withAuth";


import Navbar from "../components/navbar/navbar";

import IPath from "../interfaces/IPath"

type Props = {
    children?: ReactNode
    title?: string
}

const paths : IPath[] = [
    {
        to: "/login", name: "Login",
    },
    {
        to: "/register", name: "Register"
    }

]


const LoginLayout = ({children, title} : Props) => {

    return (
        <>
            <Head>
                <title>{title}</title>
                <meta charSet="utf-8" />
                <meta name="viewport" content="initial-scale=1.0, width=device-width" />
            </Head>
            <Navbar paths={paths} privateType={false}/>

            {children}
        </>
    );
};

export default  LoginLayout;