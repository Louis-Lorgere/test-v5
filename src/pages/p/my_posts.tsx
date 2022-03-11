import { Box } from "@material-ui/core";
import { getSession } from "next-auth/react";
import { useEffect, useState } from "react";
import TestimonialSection from "../../components/TestimonialSection";
import useRequest from "../../hooks/useRequest";

import type { Post } from "@prisma/client";

const MyPosts = ({ session }) => {

  const { isLoading, serverError, doFetch, apiData } = useRequest("GET", "post");

  const[posts, setPosts] = useState([])
  const [displayPosts, setDisplayPosts] = useState(<TestimonialSection testimonials={[]} />)

  console.log(isLoading)
  useEffect(() => {
    doFetch()
    console.log(isLoading)
  }, [])

  useEffect(() => {
    if (isLoading === false) {
      setPosts(apiData)
      console.log(posts)
    }
    if(posts){
      const userPosts: any = posts.filter(post => post.authorId === session.user.id );
      console.log(userPosts)
      setDisplayPosts(<TestimonialSection testimonials={userPosts} />)
    }
  },[isLoading, posts]);

  return (
    <Box sx={{ mb: 8, display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
      <h1>Mes annonces</h1>
      {displayPosts}
    </Box>
    
  )
}

export async function getServerSideProps(context) {

  const session = await getSession(context)

  if (!session) {
    return {
      redirect: {
        destination: '/',
        permanent: false,
      },
    }
  }
  if (session){
    return {
      props: {
        session: session
      },
    };
  }
}

export default MyPosts