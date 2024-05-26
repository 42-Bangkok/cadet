import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { db } from "@/lib/db/clients";
import { AddRoleForm } from "./_components/add-role-form";
import { RemoveRoleBtn } from "./_components/remove-role-btn";

async function queryUserRoles() {
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
  const roles = await queryUserRoles();
  roles.sort((a, b) => a.role.name.localeCompare(b.role.name));
  return (
    <div>
      <h1 className="font-bold">Super bare-bone IAM (tm)</h1>
      <p>
        Add or remove roles, if the user does not exist it will be added when
        logged in. A user can have multiple roles.
      </p>
      <AddRoleForm />
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Tools</TableHead>
            <TableHead>Intra ID</TableHead>
            <TableHead>Name</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Role</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {roles.map((row) => (
            <TableRow key={row.user.id}>
              <TableCell>
                <RemoveRoleBtn userId={row.user.id} roleId={row.role.id} />
              </TableCell>
              <TableCell>{row.user.accounts[0].providerAccountId}</TableCell>
              <TableCell>{row.user.name}</TableCell>
              <TableCell>{row.user.email}</TableCell>
              <TableCell>{row.role.name}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
