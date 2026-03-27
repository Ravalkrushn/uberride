import React, { useState, useEffect } from "react";
import { userService } from "../../services/user.service";
import { Card } from "../../components/common/Card";
import { Button } from "../../components/common/Button";
import { Loader } from "../../components/common/Loader";
import { EmptyState } from "../../components/common/EmptyState";

export const UsersManagement = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);

  useEffect(() => {
    fetchUsers();
  }, [page]);

  const fetchUsers = async () => {
    try {
      // Mock data - replace with actual API
      setUsers([
        {
          _id: "1",
          fullname: "John Doe",
          email: "john@example.com",
          phone: "+919876543210",
          ridesCount: 25,
        },
        {
          _id: "2",
          fullname: "Jane Smith",
          email: "jane@example.com",
          phone: "+919876543211",
          ridesCount: 18,
        },
      ]);
      setLoading(false);
    } catch (err) {
      setLoading(false);
    }
  };

  if (loading) return <Loader fullScreen />;

  return (
    <div className="min-h-screen bg-white p-4">
      <h1 className="text-2xl font-bold mb-6">Users Management</h1>

      {users.length > 0 ? (
        <div className="space-y-3">
          {users.map((user) => (
            <Card key={user._id} hover>
              <div className="flex justify-between items-start">
                <div>
                  <p className="font-bold">{user.fullname}</p>
                  <p className="text-sm text-gray-600">{user.email}</p>
                  <p className="text-sm text-gray-600">{user.phone}</p>
                  <p className="text-xs text-gray-500 mt-1">
                    Rides: {user.ridesCount}
                  </p>
                </div>
                <div className="flex gap-2">
                  <Button variant="secondary" size="sm">
                    View
                  </Button>
                  <Button variant="danger" size="sm">
                    Block
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      ) : (
        <EmptyState title="No Users" description="No users found" />
      )}
    </div>
  );
};
