using System;

namespace ApiIdentity.Models;

public class UserRoles
{
    public int UserId { get; set; }
    public int RoleId { get; set; }
    public DateTime AssignedAt { get; set; } = DateTime.Now;

    public virtual Users User { get; set; } = null!;
    public virtual Roles Role { get; set; } = null!;
}
