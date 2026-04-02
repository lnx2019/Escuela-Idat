using Aspire.Hosting;

var builder = DistributedApplication.CreateBuilder(args);

var apiIdentity = builder.AddProject<Projects.ApiIdentity>("apiidentity");
var apiProfiles = builder.AddProject<Projects.ApiProfiles>("apiprofiles");
var apiBilling = builder.AddProject<Projects.ApiBilling>("apibilling");
var apiWorkouts = builder.AddProject<Projects.ApiWorkouts>("apiworkouts");

builder.Build().Run();