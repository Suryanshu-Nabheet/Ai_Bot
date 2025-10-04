"""
Database seeding script for development.
"""
import asyncio
from app.core.database import AsyncSessionLocal
from app.models.user import User


async def seed_database():
    """Seed the database with sample data."""
    async with AsyncSessionLocal() as session:
        # Create sample user
        sample_user = User(
            id="user-1",
            email="demo@aidevplatform.com",
            name="Demo User",
            avatar="https://api.dicebear.com/7.x/avataaars/svg?seed=demo",
            github_id="demo-github-id"
        )
        
        session.add(sample_user)
        await session.commit()
        
        print("✅ Database seeded successfully")


if __name__ == "__main__":
    asyncio.run(seed_database())
