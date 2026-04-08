using System;
using System.Collections.Generic;

namespace ApiIdentity.Models;

public class Roles
{
    public int RoleId { get; set; }
    public string Name { get; set; } = string.Empty;
    public string NormalizedName { get; set; } = string.Empty;
    public bool IsActive { get; set; } = true;
    public DateTime CreatedAt { get; set; } = DateTime.Now;

    public virtual ICollection<UserRoles> UserRoles { get; set; } = new List<UserRoles>();
}
