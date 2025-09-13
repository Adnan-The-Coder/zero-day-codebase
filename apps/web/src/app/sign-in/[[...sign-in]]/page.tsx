import { SignedOut, SignIn } from "@clerk/nextjs";

export const runtime = 'edge';

export default function Page() {
    return (
      <div className="sign-in-container" style={{ minHeight: "100vh", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
        <div style={{ padding: "20px", margin: "20px" }}>
          <SignedOut>
            <SignIn appearance={{
            elements: {
              rootBox: {
                boxShadow: "0px 0px 10px rgba(0, 0, 0, 0.1)"
              }
            }
          }} />
          </SignedOut>
        </div>
      </div>
    );
}