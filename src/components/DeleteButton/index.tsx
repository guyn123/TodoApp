import React from 'react'

function DeleteButon() {
    return (
        <Space style={{ display: "flex", justifyContent: "flex-end", margin: "16px 0" }}>
            {/* {hasIncompleteSelected && ( */}
            <Button
                type="primary"
                disabled={!hasIncompleteSelected}
                onClick={handleComplete}
            >
                Hoàn thành
            </Button>
            {/* )} */}
            <Button
                danger
                disabled={selectedIds.length === 0}
                onClick={handleDelete}
            >
                Xóa
            </Button>
        </Space>
    )
}

export default DeleteButon