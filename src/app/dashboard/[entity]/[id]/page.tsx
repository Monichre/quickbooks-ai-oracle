export default async function EntityDetailPage({
  params,
}: {
  params: {entity: string; id: string}
}) {
  const {entity, id} = await params
  return (
    <div>
      EntityDetailPage: entity: {entity}, id: {id}
    </div>
  )
}
