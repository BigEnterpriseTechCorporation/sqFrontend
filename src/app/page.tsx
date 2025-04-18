import Link from "next/link"

export default function Home() {
  return (
    <div>
      <h1>Home</h1>
      <div className="gap-4 flex">
          <Link href={"/"}>Home</Link>
          <Link href={"/auth"}>Auth</Link>
          <Link href={"/login"}>login</Link>
          <Link href={"/unit"}>Unit</Link>
      </div>
    </div>
  )
}
