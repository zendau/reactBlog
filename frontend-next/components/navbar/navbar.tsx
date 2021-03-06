import React, {ReactNode, useState} from 'react';
import Link from "next/link";

import styles from "./navbar.module.scss"

import { useRouter } from "next/router";
import IPath from "../../interfaces/IPath";

interface IProps {
    children?: ReactNode
    paths: IPath[]
    privateType: boolean
}

const Navbar =  ({paths, privateType} : IProps) => {

    const [menuStatus, setMenuStatus] = useState(false)

    const router = useRouter()

    return (
        <header>
            <nav className={menuStatus ? `${styles.navbar} ${styles['navbar--active']}` : styles.navbar}>
                <div className={menuStatus ? `${styles.navbar__btn} ${styles['navbar__btn--open']}` : styles.navbar__btn} onClick={() => setMenuStatus(!menuStatus)}>
                    <span></span>
                    <span></span>
                    <span></span>
                    <span></span>
                </div>
                <div className={styles.navbar__items}>
                    <div className={styles.navbar__container}>
                        {paths.map(path => <Link href={path.to} key={path.to}><a className={router.pathname == path.to ? `${styles.navbar__item} ${styles['navbar__item--active']}` : styles.navbar__item}>{path.name}</a></Link>)}
                    </div>
                    {privateType ? <Link href="/logout"><a className={styles.navbar__item}>Exit</a></Link> : ""}
                </div>
            </nav>
        </header>
    );
}

export default Navbar;