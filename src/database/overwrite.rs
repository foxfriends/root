use sqlx::postgres::PgConnection;

#[async_trait]
pub trait Overwritable {
    async fn overwrite(&self, game: &str, conn: &mut PgConnection) -> sqlx::Result<()>;
}

#[async_trait]
impl<T> Overwritable for Vec<T>
where
    T: Overwritable + Sync,
{
    async fn overwrite(&self, game: &str, conn: &mut PgConnection) -> sqlx::Result<()> {
        for item in self {
            item.overwrite(game, conn).await?;
        }
        Ok(())
    }
}

#[async_trait]
impl<T> Overwritable for Option<T>
where
    T: Overwritable + Sync,
{
    async fn overwrite(&self, game: &str, conn: &mut PgConnection) -> sqlx::Result<()> {
        if let Some(item) = self {
            item.overwrite(game, conn).await?;
        }
        Ok(())
    }
}
