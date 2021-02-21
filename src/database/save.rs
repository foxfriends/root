use super::Deletable;
use sqlx::postgres::PgConnection;

#[async_trait]
pub trait Saveable {
    async fn save(&self, game: &str, conn: &mut PgConnection) -> sqlx::Result<()>;
}

#[async_trait]
impl<T> Saveable for Vec<T>
where
    T: Saveable + Deletable + Sync,
{
    async fn save(&self, game: &str, conn: &mut PgConnection) -> sqlx::Result<()> {
        T::delete(game, conn).await?;
        for item in self {
            item.save(game, conn).await?;
        }
        Ok(())
    }
}

#[async_trait]
impl<T> Saveable for Option<T>
where
    T: Saveable + Deletable + Sync,
{
    async fn save(&self, game: &str, conn: &mut PgConnection) -> sqlx::Result<()> {
        if let Some(item) = self {
            item.save(game, conn).await?;
        } else {
            T::delete(game, conn).await?;
        }
        Ok(())
    }
}
