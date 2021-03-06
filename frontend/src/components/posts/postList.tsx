import React, {useEffect, useMemo, useState, Suspense, useContext} from 'react';
import {IPost} from "../../interfaces/post";
import {Link} from "react-router-dom";

import "./postList.scss"
import {PageContext} from "../../context/PageContext";
import {useTypedSelector} from "../../hooks/useTypedSelector";
import {usePostObserver} from "../../hooks/usePostObserver";
import Filter from "./filter";
import FetchLoader from "../UI/fetchLoader";

interface IPostList {
    author?: string
}

const PostList : React.FC<IPostList> = ({author}) => {

    const {posts, hasMore} = useTypedSelector(state => state.post)

    const [filterType, setFilterType] = useState<string>("titleName")
    const [filterName, setFilterName] = useState<string>("")

    const [postList, setPostList] = useState<IPost[]>([])

    const {setPageNumber,} = useContext(PageContext)


    useEffect(() => {

        console.log("CHANGE TYPE")

        if (filterType === "date") {
            setPostList([...posts.sort((a: IPost, b : IPost) => a.date.localeCompare(b.date))])
        } else if (filterType === "titleName") {
            setPostList([...posts.sort((a: IPost, b : IPost) => a.title.localeCompare(b.title))])
        } else if (filterType === "authorName") {
            setPostList([...posts.sort((a: IPost, b : IPost) => a.author.email.localeCompare(b.author.email))])
        }

    }, [posts, filterType])


    const observerCallback = usePostObserver(setPageNumber, hasMore)


    const filterPostsByName = useMemo(
        () => postList.filter(post => post.title.includes(filterName)),
        [filterName, postList])

    function generateCard(postData: IPost, isLast: boolean) {


        if (isLast) {
            return (
                <div ref={observerCallback} key={postData.id} className="post">
                    <div className="post__header">
                        <h2 className="post__title">{postData.title}</h2>
                        <small>{postData.date}</small>
                        <p className="post__body">{postData.author.email}</p>
                    </div>
                    <div className="post__footer">
                        <Link to={`/post/${postData.id}`} className="btn post__btn">Read post</Link>
                        <p className="post__author">{postData.author.email}</p>
                    </div>
                </div>)
        } else {
            return (
                <div key={postData.id} className="post">
                    <div className="post__header">
                        <h2 className="post__title">{postData.title}</h2>
                        <small>{postData.date}</small>
                        <p className="post__body">{postData.author.email}</p>
                    </div>
                    <div className="post__footer">
                        <Link to={`/post/${postData.id}`} className="btn post__btn">Read post</Link>
                        <p className="post__author">{postData.author.email}</p>
                    </div>
                </div>)
        }

    }
    return (
        <Suspense fallback={<FetchLoader/>}>
            <Filter
                filterType={filterType}
                setFilterType={setFilterType}
                filterName={filterName}
                setFilterName={setFilterName}
            />
            {filterPostsByName.length !== 0 ?
                <>
                    <section className="posts-container">
                        {author ? <h1 className="posts__title">{author}'s posts</h1> : ""}
                        {filterPostsByName.map((post,index) =>
                            filterPostsByName.length === index + 1 ? generateCard(post, true)
                            : generateCard(post, false)
                        )}
                    </section>
                </>
                :
                <h1 className="message-info">No have posts</h1>
            }

        </Suspense>
    )
}

export default PostList