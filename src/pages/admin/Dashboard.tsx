
const handleSignOut = async () => {
  try {
    await auth.signOut();
    navigate("/login");  // Explicitly navigate to login page
    toast.success("Sesión cerrada correctamente");
  } catch (error) {
    console.error("Error al cerrar sesión:", error);
    toast.error("Error al cerrar sesión");
  }
};
