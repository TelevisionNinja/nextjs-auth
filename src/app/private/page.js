import { verifySession } from "../../lib/dal";
import ARIASelect from "../../lib/components/ARIASelect";
import "./globals.css";

const options = [
    { value: 'chocolate', label: 'Chocolate' },
    { value: 'strawberry', label: 'Strawberry' },
    { value: 'vanilla', label: 'Vanilla' },
    { value: 'cookies', label: 'Cookies and Cream' },
    { value: 'mint', label: 'Mint Chocolate Chip' },
    { value: 'rocky', label: 'Rocky Road' },
    { value: 'coffee', label: 'Coffee' }
];

export default async function PrivatePage() {
  const currentUser = await verifySession();

  return (
    <div className="container">
      <h1>Private: {currentUser.role}</h1>
      <div className="flex">
        <a href="/">Home</a>
      </div>
      <ARIASelect options={options}/>
    </div>
  );
}
