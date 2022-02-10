import type { GetServerSideProps, NextPage } from 'next'
import { FormEvent, useContext, useState } from 'react'
import styles from '../styles/Home.module.css'
import {AuthContext} from '../context/AuthContext'
import { parseCookies } from 'nookies'
import { withSSRGuest } from '../utils/withSSRGuest'
const Home: NextPage = () => {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const {isAuthenticated, signIn } = useContext(AuthContext)


async function handleSubmit(event: FormEvent){


    event.preventDefault()


  const data = {
    email: email,
    password: password
  }
   await signIn(data)
}

  return (
    <form className={styles.container} onSubmit={handleSubmit}>
      <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
      <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
      <button type="submit">Entrar</button>
    </form>
  )
}

export default Home


export const getServerSideProps = withSSRGuest(async (ctx) => {
  return {
    props: {},
  }
})
