import { db } from "@/lib/db/clients";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

async function queryRoles() {
  const roles = await db.query.usersToRoles.findMany({
    columns: {},
    with: {
      user: {
        columns: {
          id: true,
          name: true,
          email: true,
        },
        with: {
          accounts: {
            columns: {
              provider: true,
              providerAccountId: true,
            },
          },
        },
      },
      role: true,
    },
  });
  return roles;
}

export default async function Page() {
  const roles = await queryRoles();
  roles.sort((a, b) => a.role.name.localeCompare(b.role.name));
  return (
    <div>
      <h1 className="font-bold">Super bare-bone IAM (tm)</h1>
      <p></p>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Intra ID</TableHead>
            <TableHead>Name</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Role</TableHead>
            <TableHead>Role</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {roles.map((row) => (
            <TableRow key={row.user.id}>
              <TableCell>{row.user.accounts[0].providerAccountId}</TableCell>
              <TableCell>{row.user.name}</TableCell>
              <TableCell>{row.user.email}</TableCell>
              <TableCell>{row.role.name}</TableCell>
              <TableCell>{row.role.description}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
