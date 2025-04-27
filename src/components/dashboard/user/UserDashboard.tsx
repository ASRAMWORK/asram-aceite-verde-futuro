
// Ensure the logout function redirects to login
const handleLogout = async () => {
  try {
    await logout();
    navigate("/login");
  } catch (error) {
    console.error("Logout error:", error);
    toast.error("Error al cerrar sesión");
  }
};

// Update the logout button to use this new handler
<Button 
  variant="destructive" 
  onClick={handleLogout}
  className="w-full"
>
  Cerrar Sesión
</Button>
