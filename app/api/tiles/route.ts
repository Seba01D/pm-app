// pages/api/tiles.ts

import { NextApiRequest, NextApiResponse } from 'next';
import { createSupabaseBrowser } from '@/lib/supabase/client';

const supabase = createSupabaseBrowser();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { method } = req;

  switch (method) {
    case 'GET':
      const { projectId } = req.query;
      const { data, error } = await supabase
        .from('project_tiles')
        .select('*')
        .eq('project_id', projectId);

      if (error) return res.status(500).json({ error: error.message });
      return res.status(200).json(data);

    case 'POST':
      const { name, projectId: postProjectId } = req.body;
      const { data: newTile, error: postError } = await supabase
        .from('project_tiles')
        .insert([{ name, project_id: postProjectId }])
        .select()
        .single();

      if (postError) return res.status(500).json({ error: postError.message });
      return res.status(201).json(newTile);

    case 'PUT':
      const { tileId, newName } = req.body;
      const { error: putError } = await supabase
        .from('project_tiles')
        .update({ name: newName })
        .eq('id', tileId);

      if (putError) return res.status(500).json({ error: putError.message });
      return res.status(200).json({ message: 'Tile updated' });

    case 'DELETE':
      const { deleteId } = req.body;
      const { error: deleteError } = await supabase
        .from('project_tiles')
        .delete()
        .eq('id', deleteId);

      if (deleteError) return res.status(500).json({ error: deleteError.message });
      return res.status(200).json({ message: 'Tile deleted' });

    default:
      return res.status(405).json({ message: `Method ${method} Not Allowed` });
  }
}
