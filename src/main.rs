#[macro_use]
extern crate lazy_static;

use colored::*;
use log::info;
use sqlx::postgres::PgPoolOptions;
use warp::Filter;

mod handler;
pub mod models;

use handler::handler;

#[tokio::main]
async fn main() {
    dotenv::dotenv().unwrap();
    let pgport =
        std::env::var("PGPORT").expect("Environment variable `PGPORT` is required");
    let pghost =
        std::env::var("PGHOST").expect("Environment variable `PGHOST` is required");
    let pguser =
        std::env::var("root_pguser").expect("Environment variable `root_pguser` is required");
    let pgpassword =
        std::env::var("root_pgpassword").expect("Environment variable `root_pgpassword` is required");
    let pgdatabase =
        std::env::var("root_pgdatabase").expect("Environment variable `root_pgdatabase` is required");
    let database_url = format!("postgres://{}:{}@{}:{}/{}", pguser, pgpassword, pghost, pgport, pgdatabase);
    let pool = PgPoolOptions::new()
        .connect(&database_url)
        .await
        .expect("Database connection failed.");
    pretty_env_logger::init();

    let dist_dir = std::env::var("root_dist_dir").unwrap_or_else(|_| "dist".to_owned());
    let port: u16 = std::env::var("root_port")
        .ok()
        .and_then(|s| s.parse().ok())
        .unwrap_or(3000);

    let game = warp::path("game")
        .and(warp::ws())
        .map(|ws: warp::ws::Ws| ws.on_upgrade(handler));
    let web = warp::fs::dir(dist_dir).with(warp::reply::with::header("Cache-Control", "no-cache"));
    let routes = game.or(web);

    info!(
        "Server started at {}",
        format!("http://localhost:{}", port).cyan()
    );
    warp::serve(routes).run(([127, 0, 0, 1], port)).await;
}
