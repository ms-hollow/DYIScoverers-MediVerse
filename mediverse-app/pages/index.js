import Head from "next/head";
import Image from "next/image";
import Link from "next/link"
import styles from "@/styles/Home.module.css";

export default function Home() {
  return (
    <>
      <div>
        <h1 class="text">Landing Page or Home</h1>
        <Link href="/register-patient">Register</Link>
      </div>
    </>
  );
}
