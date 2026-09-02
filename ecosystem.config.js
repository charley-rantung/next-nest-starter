module.exports = {
  apps: [
    {
      name: "starter-pack/api",
      cwd: "./apps/api",
      script: "npm",
      args: "run start:prod",
    },
    {
      name: "starter-pack/web",
      cwd: "./apps/web",
      script: "npm",
      args: "start",
    },
  ],
}
