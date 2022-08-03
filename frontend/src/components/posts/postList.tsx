import React, { useEffect, useMemo, useState, Suspense, useContext, useRef } from 'react';
import { IPost } from "../../interfaces/IPost";
import { Link } from "react-router-dom";

import "./postList.scss"
import { useTypedSelector } from "../../hooks/useTypedSelector";
import { usePostObserver } from "../../hooks/usePostObserver";
import Filter from "./filter";
import FetchLoader from "../UI/fetchLoader/fetchLoader";
import { useAction } from '@/hooks/useAction';

interface IPostList {
  author?: string
}

function dateFormat(date: string) {
  const formatter = new Intl.DateTimeFormat("ru")
  const dateFormat = new Date(date)

  return formatter.format(dateFormat)
}

function createPostPreview(body: string) {
  const previewLimit = 250

  if (body.length < previewLimit) {
    return body 
  } 

  return `${body.substring(0, previewLimit)}...`
}

const PostList: React.FC<IPostList> = ({ author }) => {

  const { posts, hasMore } = useTypedSelector(state => state.postState)

  const [filterType, setFilterType] = useState<string>("")
  const [filterName, setFilterName] = useState<string>("")

  const [postList, setPostList] = useState<IPost[]>([])

  const upBtnRef = useRef(null)

  useEffect(() => {
    if (filterType === "date") {
      setPostList([...posts.sort((a: IPost, b: IPost) => a.date.localeCompare(b.date))])
    } else if (filterType === "titleName") {

      const tempPosts = structuredClone(posts)
      const sortedPosts = tempPosts.sort((a: IPost, b: IPost) => a.title.localeCompare(b.title))
      setPostList(sortedPosts)
    } else if (filterType === "authorName") {
      setPostList([...posts.sort((a: IPost, b: IPost) => a.author.email.localeCompare(b.author.email))])
    } else {
      setPostList(posts)
    }

  }, [posts, filterType])


  const observerCallback = usePostObserver()


  const filterPostsByName = useMemo(
    () => postList.filter(post => post.title.includes(filterName)),
    [filterName, postList])

  function generateCard(postData: IPost, isLast: boolean) {

    return (
      <div key={postData.id} className="post">
        {
          isLast ?
            <div ref={observerCallback}></div>
            : ""
        }
        <div className="post__header">
          <h2 className="post__title">{postData.title}</h2>
          <small>{dateFormat(postData.date)}</small>
          <p className="post__body" dangerouslySetInnerHTML={{ __html: createPostPreview(postData.body) }}></p>
        </div>
        <div className="post__footer">
          <Link to={`/post/${postData.id}`} className="btn post__btn">Read post</Link>
          <p className="post__author">{postData.author.email}</p>
        </div>
      </div>
    )
  }


  function onUpButton() {
    window.scrollTo(0, 0)
    
  }

  return (
    <Suspense fallback={<FetchLoader />}>
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
            {filterPostsByName.map((post, index) =>
              filterPostsByName.length === index + 1 ? generateCard(post, true)
                : generateCard(post, false)
            )}
          </section>
        </>
        :
        <h1 className="message-info">No have posts</h1>
      }
      <button ref={upBtnRef} onClick={onUpButton} className='posts__up'>UP</button>

    </Suspense>
  )
}

export default PostList