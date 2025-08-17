{ pkgs, ... }: {
  # Use the unstable channel to get newer package versions
  channel = "unstable";

  packages = [
    # This will provide a more recent version of Node.js 20
    pkgs.nodejs_20
  ];

  idx.previews = {
    enable = true;
    previews = {
      web = {
        # Correct the command to 'npm run dev'
        command = [
          "npm"
          "run"
          "dev"
          "--"
          "--port"
          "$PORT"
          "--host"
          "0.0.0.0"
        ];
        manager = "web";
      };
    };
  };
}
