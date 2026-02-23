#!/bin/bash

# AO Vault Database Backup Script
# Automatically backs up the SQLite database with timestamps

# Configuration
DB_PATH="./database/ao_vault.db"
BACKUP_DIR="./database/backups"
TIMESTAMP=$(date +"%Y%m%d_%H%M%S")
BACKUP_NAME="ao_vault_backup_${TIMESTAMP}.db"
MAX_BACKUPS=10  # Keep only the last 10 backups

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${GREEN}==================================${NC}"
echo -e "${GREEN}   AO Vault Database Backup${NC}"
echo -e "${GREEN}==================================${NC}"

# Check if database exists
if [ ! -f "$DB_PATH" ]; then
    echo -e "${RED}Error: Database not found at $DB_PATH${NC}"
    exit 1
fi

# Create backup directory if it doesn't exist
if [ ! -d "$BACKUP_DIR" ]; then
    echo -e "${YELLOW}Creating backup directory...${NC}"
    mkdir -p "$BACKUP_DIR"
fi

# Get database size
DB_SIZE=$(du -h "$DB_PATH" | cut -f1)
echo -e "Database size: ${YELLOW}$DB_SIZE${NC}"

# Create backup
echo -e "Creating backup: ${YELLOW}$BACKUP_NAME${NC}"
cp "$DB_PATH" "$BACKUP_DIR/$BACKUP_NAME"

# Verify backup
if [ -f "$BACKUP_DIR/$BACKUP_NAME" ]; then
    BACKUP_SIZE=$(du -h "$BACKUP_DIR/$BACKUP_NAME" | cut -f1)
    echo -e "${GREEN}✓ Backup created successfully!${NC}"
    echo -e "Backup size: ${YELLOW}$BACKUP_SIZE${NC}"
    echo -e "Location: ${YELLOW}$BACKUP_DIR/$BACKUP_NAME${NC}"
else
    echo -e "${RED}✗ Backup failed!${NC}"
    exit 1
fi

# Clean up old backups (keep only the last MAX_BACKUPS)
echo -e "\nCleaning up old backups..."
cd "$BACKUP_DIR"
BACKUP_COUNT=$(ls -1 ao_vault_backup_*.db 2>/dev/null | wc -l)

if [ "$BACKUP_COUNT" -gt "$MAX_BACKUPS" ]; then
    # Calculate how many to delete
    DELETE_COUNT=$((BACKUP_COUNT - MAX_BACKUPS))
    echo -e "Found ${YELLOW}$BACKUP_COUNT${NC} backups, keeping ${YELLOW}$MAX_BACKUPS${NC}"

    # Delete oldest backups
    ls -1t ao_vault_backup_*.db | tail -n "$DELETE_COUNT" | while read file; do
        echo -e "Deleting old backup: ${YELLOW}$file${NC}"
        rm "$file"
    done
fi

# List current backups
echo -e "\n${GREEN}Current backups:${NC}"
ls -1t ao_vault_backup_*.db 2>/dev/null | head -n 5 | while read file; do
    SIZE=$(du -h "$file" | cut -f1)
    echo -e "  • $file (${SIZE})"
done

# Show restore command
echo -e "\n${GREEN}To restore from this backup:${NC}"
echo -e "${YELLOW}cp $BACKUP_DIR/$BACKUP_NAME $DB_PATH${NC}"

echo -e "\n${GREEN}==================================${NC}"
echo -e "${GREEN}   Backup Complete!${NC}"
echo -e "${GREEN}==================================${NC}"