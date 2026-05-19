import { ContactsClientPage } from "@/features/contacts/components/contacts-client-page";
import { 
    mockCompanyContacts,
    mockContacts,
} from "@/features/contacts/data/mock-contacts";

export default function ContactsPage() {
  return (
    <ContactsClientPage
      contacts={mockContacts}
      relations={mockCompanyContacts}
    />
  );
}