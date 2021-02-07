#[macro_use]
extern crate lazy_static;
#[macro_use]
extern crate async_trait;

use colored::*;
use log::info;
use once_cell::sync::OnceCell;
use sqlx::postgres::{PgPool, PgPoolOptions};
use warp::Filter;

mod database;
mod handler;
mod models;

use handler::handler;

static POOL: OnceCell<PgPool> = OnceCell::new();

#[tokio::main]
async fn main() {
    dotenv::dotenv().unwrap();
    pretty_env_logger::init();

    let database_url = std::env::var("root_database_url")
        .expect("Environment variable `root_database_url` is required");
    let pool = PgPoolOptions::new()
        .connect(&database_url)
        .await
        .expect("Database connection failed.");

    POOL.set(pool).unwrap();

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
    POOL.get().unwrap().close().await;
}
